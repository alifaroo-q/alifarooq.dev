/**
 * The DOM event the contact form fires once a message is sent. The motion
 * runtime listens for it to sweep the lighthouse beam; the two never import
 * each other, so the form's lazy chunk stays free of GSAP.
 */
export const CONTACT_SENT = "contact:sent";
