import { router } from "@renderer/config/routes.config";
import { RouterProvider } from "react-router-dom";


export default function App() {
  return <RouterProvider router={router}/>
}
