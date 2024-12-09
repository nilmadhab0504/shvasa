'use client'

import {useState,useEffect} from "react"
import { useSession, signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


const Header = () => {
  const { data: session } = useSession()
  const [search, setSearch] =useState("")
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
  const Router = useRouter();
  const fetchUsers = async (searchTerm:any) => {
    const response = await fetch(`/api/users?search=${searchTerm}`);
    const data = await response.json();
    setFilteredUsers(data.users);
  }

  useEffect(() => {
    if (search) {
      fetchUsers(search);
    } else {
      setFilteredUsers([]);
    }
  }, [search]);

  return (
    <header className="py-4 px-[100px] bg-background border-b">
      <div className="flex justify-between items-center mx-auto">
       

        {session?.user ? (<>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="border border-gray-300 rounded-md px-3 py-1 w-64"
              />
              {search && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-64 max-h-40 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user:any) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          Router.push(`/user/${user.id}`)
                        }}
                      >
                        {user.name}
                      </div>
                    ))
                    
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No users found</div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="destructive"
              onClick={() => signOut()}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </>) : (
          <> <h1 className="text-2xl font-bold">Calendar</h1>
          <Button
          onClick={() => {Router.push("/login")}}
          className="flex items-center space-x-2"
        >
          <span>Login</span>
        </Button>
        </>
        )}
      </div>
    </header>
  )
}

export default Header
