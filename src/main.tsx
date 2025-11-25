import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
)