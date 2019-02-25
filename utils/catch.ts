import { config } from "../beh.config";

export function Catch (text: string) {
    return function (target, key, descriptor) {
        const originalMethod = descriptor.value
    
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                if (config.debug) {
                    console.log(error);
                }
                expect(error).toEqual(text);
            }
        }
    
        return descriptor;
    }
}
