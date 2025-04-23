import { Routes, Route } from "react-router-dom";

// import pages
import PrivateLayout from "@private/privateLayout"
import Error from "@utils/error"
import Dashboard from "@private/dashboard/dashboard"
import Achats from "@private/achats/index"

import Inventaire from "@private/inventaire/index"
//import Inventaire from "@private/inventaire/inventaire"

import Machines from "@private/machines/index"
import DetailsVehicle from "@/pages/private/machines/vehicles/_detailsVehicle"
import DetailsTrailer from "@/pages/private/machines/trailers/_detailsTrailer"
import DetailsEquipment from "@/pages/private/machines/equipments/_detailsEquipment"
import DetailsMachine from "@/pages/private/machines/machines/_detailsMachine"

/*import DetailsEngin from "@private/machines/_detailsEngin"
import DetailsOther from "@private/machines/_detailsOther"*/

import Contacts from "@private/contacts/contacts"
import Horaires from "@private/horaires/horaires"
import Panier from "@private/panier/panier"
import Calendrier from "@private/calendrier/calendrier"
import Analytics from "@private/analytics/analytics"

import Administratif from "@private/administratif/index"
import DetailsShow from "@private/administratif/shows/_detailsShow"

import Utilisateurs from "@private/utilisateurs/index"
import DetailsUser from "@/pages/private/utilisateurs/users/_detailsUser"

import Reglages from "@private/reglages/reglages"

import RoleGuard from "@utils/RoleGuard"


const PrivateRouter = () => {
    return (
        <Routes>
            <Route element={<PrivateLayout />}>
                <Route index element={<Dashboard />} />


                {/* NATIVE ACCESS */}
                <Route path="error" element={<Error />} />
                <Route path="home" element={<Dashboard />} />
                <Route path="horaires" element={<Horaires />} />
                <Route path="reglages" element={<Reglages />} />
                <Route path="panier" element={<Panier />} />

                {/* GUARDED ACCESS */}
                <Route path="achats" element={<RoleGuard page="achats"><Achats /></RoleGuard>} />

                <Route path="inventaire" element={<RoleGuard page="inventaire"><Inventaire /></RoleGuard>} />
                <Route path="inventaire/*" element={<Error />} />

                <Route path="machines" element={<RoleGuard page="vehicules"><Machines /></RoleGuard>} />
                <Route path="machines/detailsVehicle" element={<RoleGuard page="vehicules"><DetailsVehicle /></RoleGuard>} />
                <Route path="machines/detailsTrailer" element={<RoleGuard page="vehicules"><DetailsTrailer /></RoleGuard>} />
                <Route path="machines/detailsEquipment" element={<RoleGuard page="vehicules"><DetailsEquipment /></RoleGuard>} />
                <Route path="machines/detailsMachine" element={<RoleGuard page="vehicules"><DetailsMachine /></RoleGuard>} />
                <Route path="machines/*" element={<Error />} />

                <Route path="contacts" element={<RoleGuard page="contacts"><Contacts /></RoleGuard>} />
                <Route path="calendrier" element={<RoleGuard page="calendrier"><Calendrier /></RoleGuard>} />
                <Route path="analytics" element={<RoleGuard page="analytics"><Analytics /></RoleGuard>} />

                <Route path="administratif" element={<RoleGuard page="administratif"><Administratif /></RoleGuard>} />
                <Route path="administratif/detailsShow" element={<RoleGuard page="administratif"><DetailsShow /></RoleGuard>} />
                <Route path="administratif/*" element={<Error />} />


                <Route path="utilisateurs" element={<RoleGuard page="utilisateurs"><Utilisateurs /></RoleGuard>} />
                <Route path="utilisateurs/detailsUser" element={<RoleGuard page="utilisateurs"><DetailsUser /></RoleGuard>} />
                <Route path="utilisateurs/*" element={<Error />} />


                <Route path="*" element={<Error />} />
            </Route>
        </Routes>
    );
};

export default PrivateRouter