import { Button } from "@ui/button"

export default function Contacts() {

  return (
    <>
      <div className="flex items-center pb-1 border-b">
        <h1 className="font-semibold text-2xl">CONTACTS</h1>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Aucun contact :(
          </h3>
          <p className="text-sm text-muted-foreground">
            Vous pourrez bientôt afficher vos contacts ici !
          </p>
          <Button className="mt-4">Ajouter un contact</Button>
        </div>
      </div>
    </>
  )
}
