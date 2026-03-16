import { Provider } from "react-redux";
import store from "@/app/store";

<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>