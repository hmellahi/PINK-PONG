# Transandance Project

<!-- **Demo:** Explore the live demo of this project at [matcha.hmellahi.me](https://matcha.hmellahi.me) -->

## Project Overview

I collaborated with my classmates to create an intuitive online ping pong game platform for our final school project. This platform features real-time chat capabilities and multiplayer gameplay, offering users the ability to challenge friends, join queues, and observe other players in action.

<div align="center">
  <img style="box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);" src="/blob/master/Feed.png?raw=true" alt="Matcha Project" width="80%">
  <p><em>Screenshot of the Matcha Feed Page</em></p>
</div>

## Technology Stack

This project employs a range of cutting-edge technologies:

<div style="display: flex; align-items: center; margin-left: 10px; margin-right: 10px;">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg" width="18" height="18" alt="Vue" />
  <span style="margin-left: 5px;"><strong>Vue 3:</strong> Frontend framework for building user interfaces.</span>
</div>

<div style="display: flex; align-items: center; margin-left: 10px; margin-right: 10px;">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="18" height="18" alt="TailwindCSS" />
  <span style="margin-left: 5px;"><strong>Tailwind CSS:</strong> Styling library for modern and responsive user interfaces.</span>
</div>

<div style="display: flex; align-items: center; margin-left: 10px; margin-right: 10px;">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nestjs-colored.svg" width="18" height="18" alt="NestJS" />
  <span style="margin-left: 5px;"><strong>Nest JS:</strong> Backend framework for building the server-side application logic.</span>
</div>

<div style="display: flex; align-items: center; margin-left: 10px; margin-right: 10px;">
  <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg" width="18" height="18" alt="PostgreSQL" />
  <span style="margin-left: 5px;"><strong>Postgres:</strong> Database for efficient data storage.</span>
</div>

<div style="display: flex; align-items: center; margin-left: 10px; margin-right: 10px;">
  <img src="https://github.com/python-websockets/websockets/raw/main/logo/icon.svg" width="18" height="18" alt="JavaScript" />
  <span style="margin-left: 5px;"><strong>WebSockets:</strong> Real-time communication for online gameplay and chat.</span>
</div>

## Installation

To run the Matcha project locally, follow these steps:

1. Ensure Docker is installed on your system. Refer to the Docker documentation for installation instructions.
2. Clone the project repository to your local machine.
3. Run `docker-compose up -d` command to start the application.

Once the application is built and launched, access it by visiting [http://localhost:5678](http://localhost:5678) in your web browser. If you encounter any issues during installation, please let me know.

## Key Features

### Game

The primary purpose is to play Pong against other players:

- Live Pong game playable on the website.
- Matchmaking system for automatic player pairing.
- Faithful representation of original Pong (1972) with potential customization options.
- The Game is Responsive

This project aims to provide an engaging user experience, combining real-time gameplay, social interaction, and security measures.

### User Account

The user account functionality includes:

- OAuth login using the 42 intranet system.
- Unique user names and avatar uploads (with default avatar if not uploaded).
- Two-factor authentication using Google Authenticator.
- Friends list and real-time status tracking.
- Display of user statistics, achievements, ladder level, and match history.

### Chat

The chat system offers the following features:

- Creation of public, private, or password-protected channels.
- Direct messaging between users.
- Blocking of users to prevent messages.
- Channel ownership with password protection and administration rights.
- Invitations to Pong games and access to player profiles.

### Security Concerns

To ensure security, the project addresses several concerns:

- Passwords stored in the database are hashed.
- Protection against SQL injections is implemented.
- Server-side validation for forms and user input is incorporated.
- Sensitive information is stored locally in a `.env` file.

## Contributing

Contributions and feedback are welcome! Feel free to create issues or pull requests to improve this project.

---

_Disclaimer: Matcha is a project created for educational purposes and is not affiliated with Tinder or any dating platform._
