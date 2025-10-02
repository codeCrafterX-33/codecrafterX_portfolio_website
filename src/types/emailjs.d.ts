declare module "@emailjs/browser" {
  export function sendForm(
    serviceId: string,
    templateId: string,
    form: HTMLFormElement,
    publicKey: string
  ): Promise<any>;
}
