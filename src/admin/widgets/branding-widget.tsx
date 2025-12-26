// import { defineWidgetConfig } from "@medusajs/admin-sdk"

// This widget injects CSS to override the default Medusa logo on the login page
const LoginBranding = () => {
  return (
    <style>{`
      /* 
         Target the Logo Container 
         We use the specific combination of classes used by AvatarBox 
      */
      div[class*="bg-ui-button-neutral"][class*="w-[50px]"] {
        /* Replace with your logo URL or base64 */
        background-image: url('https://placehold.co/100x100?text=S') !important;
        background-size: cover !important;
        background-color: transparent !important;
        box-shadow: none !important;
      }
      
      /* Hide the default SVG Icon inside the container */
      div[class*="bg-ui-button-neutral"][class*="w-[50px]"] svg {
        display: none !important;
      }

      /* Hide the 'gradient' pseudo-element if present */
      div[class*="bg-ui-button-neutral"][class*="w-[50px]"]::after {
        display: none !important;
      }
    `}</style>
  )
}

// export const config = defineWidgetConfig({
//     zone: "login.before",
// })

export default LoginBranding
