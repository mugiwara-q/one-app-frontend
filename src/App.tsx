import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@partials/ThemeProvider"
import PublicRouter from "@public/publicRouter"
import PrivateRouter from "@private/privateRouter"
import AuthRouter from "@auth/authRouter"
import AuthGuard from "@utils/AuthGuard"

export default function App() {

  return (
    <div className="App">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>

          <Routes>
            <Route path="/*" element={<PublicRouter />} />

            <Route path="/dashboard/*" element={
              <AuthGuard>
                <PrivateRouter />
              </AuthGuard>
            } />

            <Route path="/auth/*" element={<AuthRouter />} />
          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    </div>

  )
}
