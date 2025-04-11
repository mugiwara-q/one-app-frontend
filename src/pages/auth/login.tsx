import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Card, CardContent } from "@components/ui/card"

import rightImg from "@assets/images/placeholder.svg"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import {
  CircleCheck,
  CircleX,
} from "lucide-react"

import { accountService } from "@/_services/account.service"

export default function Login() {

  let navigate = useNavigate()

  /***************** STATE VARIABLES *****************/
  const [submitState, setSubmitState] = useState<string>("") // for spin animation

  /***************** SET CREDENTIALS *****************/
  const [credentials, setCredentials] = useState({
    login: "",
    password: ""
  })

  /***************** SET CREDENTIALS INSIDE INPUTS *****************/
  const onChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  /***************** SUBMIT CREDENTIALS TO API *****************/
  const onSubmit = (e: any) => {
    e.preventDefault()
    setSubmitState("loading")

    accountService.login(credentials)
      .then((res: any) => {
        accountService.saveToken(res.data.access_token)
        navigate("/dashboard/home", { replace: true })
      })
      .catch(() => {
        //console.log(e)
        setSubmitState("error")
      })
  }

  /***************** STATE SUBMIT INFORMATION *****************/
  function changeState(state: string): React.ReactElement {
    switch (state) {

      case "loading":
        return (<>
          <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
            <CircleCheck className="mr-2 h-4 w-4" />
            Connexion ...
          </Button>
        </>)

      case "error":
        return (<>
          <Button variant="destructive" className="flex items-center text-center w-full">
            <CircleX className="mr-2 h-4 w-4" />
            Erreur du serveur !
          </Button>
        </>)

      case "wrong":
        return (<>
          <Button variant="destructive" className="flex items-center text-center w-full">
            <CircleX className="mr-2 h-4 w-4" />
            Email ou mot de passe erroné !
          </Button>
        </>)




      default:
        return (<></>)

    }
  }

  /***************** REDIRECT IF ALREADY LOGGED IN *****************/
  useEffect(() => {
    if (accountService.isLogged()) {
      return navigate("/dashboard/home", { replace: true })
    }
  }, [])


  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">

      <div className="flex items-center justify-center py-12 xl:flex h-screen">
        <Card className="mx-auto grid w-[350px] gap-6">
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="grid gap-2 text-center">
                <h1 className="mt-4 text-3xl font-bold">Connexion</h1>
                <p className="mb-4 text-balance text-muted-foreground">
                  Entrez votre email pour vous connecter à votre compte
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="login"
                    value={credentials.login}
                    onChange={onChange}
                    type="email"
                    placeholder="exemple@concept-evenementiel.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a href="#"
                      className="ml-auto inline-block text-sm underline">
                      Mot de passse oublié ?
                    </a>
                  </div>
                  <Input
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    autoComplete="off"
                    type="password"
                    required />
                </div>
                <Button type="submit" className="w-full" onClick={() => {
                  setSubmitState("submited")
                }}>
                  Se connecter
                </Button>


              </div>

              <div className="mt-4 text-center text-sm">
                Pas encore de compte ?{" "}
                <a href="#" className="underline">
                  Demander un compte
                </a>
              </div>
            </form>

            <div className="flex mt-5">
              {changeState(submitState)}
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="hidden bg-muted lg:block">
        <img
          src={rightImg}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  )
}
