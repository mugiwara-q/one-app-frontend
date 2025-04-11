import rightImg from "@assets/images/placeholder.svg"
import { Button } from "@ui/button"
import { Link } from "react-router-dom"


const Home = () => {

  return (
    <div className="h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">

      <div className="flex items-center justify-center py-12 xl:flex h-screen">
        <div className="mx-auto grid w-[350px] gap-6 p-6 border-2 rounded-lg">
            <p> One APP - HOME </p>
            <br/>
            <Button > <Link className="p-4" to="/auth/login">Se connecter</Link></Button>
        </div>
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

export default Home