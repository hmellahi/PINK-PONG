<template>
	<Overlay class="position-relative center">
		<!-- ><h1>Settings</h1> -->
		<div class="mb-5">
			<div class="mt-4 update_info">
				<div class="setting_user">
					<div class="avatar_setting">
						<img :src="user.avatar_url" class="avatar_change" />
						<input
							type="file"
							id="upload"
							ref="avatar"
							name="avatar"
							@change="onFileChange"
							class="d-none"
							accept="image/png, image/gif, image/jpeg"
						/>
						<label class="avatar_edit" for="upload">
							<img src="/assets/svg/add_photo_alternate.svg" alt=""
						/></label>
					</div>
					<div style="width: 100%">
						<InputField
							name="login"
							placeholder="Change Your Name"
							class="text-left p-3 my-4"
							v-model="login"
						></InputField>
						<p class="success_msg" v-if="success">{{ success }}</p>
					</div>
				</div>
			</div>
			<div v-for="(setting, i) in settings" class="row">
				<h2 class="text-left col-8">{{ setting.name }}</h2>
				<SwitchBtn class="ml-0 col-4" v-model="setting.isActive"></SwitchBtn>
				<!-- :onClick="toggle(i)" -->
			</div>
			<div class="row">
				<h2 class="text-left col-8">2-Factor Authentication</h2>
				<Button
					class="text-left px-5 m-0 mb-2"
					:onClick="showModal"
					v-if="!user.two_factor_auth_enabled"
					>Enable</Button
				>
				<Button
					class="text-left px-5 m-0 mb-2"
					:onClick="showModal"
					v-if="user.two_factor_auth_enabled"
					>Disable</Button
				>
				<!-- :onClick="toggle(i)" -->
			</div>
			<div class="col-12 px-0 fa_factor" v-if="showVerify">
				<img
					src="http://127.0.0.1:3000/api/auth/2fa/generate"
					v-if="!user.two_factor_auth_enabled"
				/>
				<div class="verify_factor">
					<InputField
						class="text-left"
						v-model="pin_code"
						placeholder="Enter the pin code"
					></InputField>
					{{ error }}
					<Button
						class="text-left px-5 m-0 mb-2"
						:onClick="enableFactor"
						v-if="!user.two_factor_auth_enabled"
						>Verify</Button
					>
					<Button
						class="text-left px-5 m-0 mb-2"
						:onClick="disableFactor"
						v-if="user.two_factor_auth_enabled"
						>Verify</Button
					>
				</div>
			</div>
		</div>

		<div class="text-right">
			<Button :onClick="saveData" class="text-left mx-0 px-5">Update</Button>
			<!-- <Button :onClick="logout">Logout</Button> -->
		</div>
	</Overlay>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwitchBtn from "@/common/components/UI/SwitchBtn.vue";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";
import { mapActions } from "vuex";
import axios from "axios";
@Component({
	components: { SwitchBtn, Button, InputField },
	computed: {
		// ...mapActions({
		//   logout: "User/logout",
		// }),
	},
})
export default class Settings extends Vue {
	settings: any[] = [];
	pin_code = "";
	error = "";
	avatar = {};
	isActive = false;
	success = "";
	showVerify = false;
	login = this.user.login;
	onFileChange(e: any) {
		let file: any = e.target.files[0];
		if (file) {
			let reader = new FileReader();
			reader.onload = (e: Event) => {
				if (e && e.target) this.$store.commit("User/setAvatar", reader.result);
			};
			reader.readAsDataURL(file);
			this.$emit("input", file);
			this.updateAvatar(file);
		}
	}
	async updateAvatar(file: any) {
		const formData = new FormData();
		formData.append("avatar", file, file.name);
		try {
			let data = await axios.post(
				`${process.env.VUE_APP_API_URL}/users/updateAvatar`,
				formData,
				{
					withCredentials: true,
					headers: {
						"Access-Control-Allow-Origin": "http://localhost:5000",
						"Access-Control-Allow-Credentials": "true",
					},
					// crossDomain: true,
				}
			);
		} catch (e: any) {
			this.success = e.response.data.message;
			return;
		}
	}
	showModal() {
		this.showVerify = true;
	}
	async enableFactor() {
		try {
			let data = await this.$http({
				method: "post",
				url: "auth/2fa/enableTwoFactorAuth",
				data: {
					code: this.pin_code,
					user: this.user,
				}
			});
			this.showVerify = false;
			this.pin_code = "";
			this.error = "";
			this.$store.commit("User/setEnableFactor", true);
		} catch (e) {
			this.error = "verification code isnt valid";
			return;
		}
	}
	async disableFactor() {
		try {
			let data = await this.$http({
				method: "post",
				url: "auth/2fa/disableTwoFactorAuth",
				data: {
					code: this.pin_code,
					user: this.user,
				}
			});
			this.showVerify = false;
			this.pin_code = "";
			this.error = "";
			this.$store.commit("User/setEnableFactor", false);
		} catch (e) {
			this.error = "verification code isnt valid";
			return;
		}
	}
	get user() {
		// return this.$store.getters["User/getCurrentUser"];
		return Object.assign({}, this.$store.getters["User/getCurrentUser"]);
	}
	// logout!: () => any;
	mounted() {
		// this.logout();
	}
	created() {
		this.settings = [
			{ name: "Music", isActive: true },
			{ name: "Sound", isActive: true },
			// {
			//   name: "2-Factor Authentication",
			//   isActive: this.user.two_factor_auth_enabled,
			// },
		];
	}
	toggle(i: any) {}
	async saveData() {
		if (this.user.login == this.login)
		{
			this.success = "wtf brooo aslan rah mbdltihach"
			return ;
		}
		try {
			let data = await this.$http({
				method: "post",
				url: "users/updateLogin",
				data: {
					login: this.login,
				}
			});
			this.$store.commit("User/setUsername", this.login);
			this.success = "Updated succefully";
		} catch (e: any) {
			this.success = e.response.data.message;
			return;
		}
	}
}
</script>

<style lang="scss">
.br {
	position: absolute;
	right: 0rem;
	bottom: 1rem;
}
InputField {
	font-size: 1.4rdem;
}
.setting_user {
	display: flex;
}
.avatar_setting {
	text-align: left;
	margin-right: 5rem;
}
.avatar_setting .avatar_edit {
	position: relative;
	left: 4rem;
	background: #fff;
	border-radius: 50%;
	padding: 5px 6px;
	top: -2rem;
}
.avatar_edit img {
	width: 23px;
}
</style>
