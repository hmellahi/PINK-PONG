// decorators.js
import { createDecorator } from 'vue-class-component'
import {ComponentOptions} from "vue";

// Declare Log decorator.
export const Logger = createDecorator((options: ComponentOptions<Vue>, key:string) => {
  if (!options || !options.methods) return;
  // Keep the original method for later.
  const originalMethod = options.methods[key]

  // Wrap the method with the logging logic.
  options.methods[key] = function wrapperMethod(...args) {
    // Print a log.
  //  console.log(`Invoked: ${key}(`, ...args, ')')
    // Invoke the original method.
    originalMethod.apply(this, args)
  }
})


