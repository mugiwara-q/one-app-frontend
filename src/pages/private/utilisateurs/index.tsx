""

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs"

import RoleList from "./roles/_roleList"
import UserList from "./users/_userList"

export default function Utilisateurs() {
    return (
        <>


            <div className="flex items-center pb-1 border-b">
                <h1 className="font-semibold text-2xl">UTILISATEURS</h1>
            </div>

            <Tabs defaultValue="usersList" className="overflow-hidden">
                <TabsList className="grid w-full mb-5 grid-cols-2">
                    <TabsTrigger value="usersList">Liste des utilisateurs</TabsTrigger>
                    <TabsTrigger value="roleList">Liste des accès</TabsTrigger>
                </TabsList>

                <TabsContent value="usersList" className="flex flex-1 flex-col gap-4 grid">
                    <UserList />
                </TabsContent>

                <TabsContent value="roleList" className="flex flex-1 flex-col gap-4 grid">
                    <RoleList />
                </TabsContent>
            </Tabs>
        </>
    )
}
