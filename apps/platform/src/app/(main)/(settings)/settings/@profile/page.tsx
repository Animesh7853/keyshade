'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import InputLoading from './loading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ControllerInstance from '@/lib/controller-instance'
import { Button } from '@/components/ui/button'

function ProfilePage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    profilePictureUrl: ''
  })
  const [isModified, setIsModified] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const updateSelf = useCallback(async () => {
    try {
      await ControllerInstance.getInstance().userController.updateSelf(
        {
          name: userData.name,
          email: userData.email === email ? undefined : email
        },
        {}
      )
      toast.success('Profile updated successfully')
    } catch (error) {
      // eslint-disable-next-line no-console -- we need to log the error
      console.error(error)
    }
    setIsModified(false)
  }, [userData, email])

  useEffect(() => {
    ControllerInstance.getInstance()
      .userController.getSelf()
      .then(({ data, success, error }) => {
        if (success && data) {
          setUserData({
            email: data.email,
            name: data.name,
            profilePictureUrl: data.profilePictureUrl || ''
          })
          setEmail(data.email)
          setIsLoading(false)
        } else {
          // eslint-disable-next-line no-console -- we need to log the error
          console.error(error)
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console -- we need to log the error
        console.error(error)
      })
  }, [])

  return (
    <main className="flex flex-col gap-y-10">
      {/* Avatar */}
      <div className="flex gap-[5vw]">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">Avatar</div>
          <span className="text-sm text-white/70">
            Upload a picture to change your avatar across Keyshade.
          </span>
        </div>
        <div className="aspect-square w-[5rem] rounded-full bg-gray-600" />
        {/* //! This is will be replaced by an image tag */}
      </div>
      {/* Name */}
      <div className="flex max-w-[20vw] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">Name</div>
          <span className="text-sm text-white/70">
            Your name is how you&apos;re identified across Keyshade.
          </span>
        </div>
        {isLoading ? (
          <InputLoading />
        ) : (
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsModified(true)
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }}
            placeholder="name"
            value={userData.name || ''}
          />
        )}
      </div>
      {/* Email */}
      <div className="flex max-w-[20vw] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">Email</div>
          <span className="text-sm text-white/70">
            Your email is used to log in and receive notifications.
          </span>
        </div>
        {isLoading ? (
          <InputLoading />
        ) : (
          <Input
            disabled
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            //   setIsModified(true)
            //   setEmail(e.target.value)
            // }}
            placeholder="email"
            value={email}
          />
        )}
      </div>
      <div>
        <Button disabled={!isModified} onClick={updateSelf} variant="secondary">
          Save Changes
        </Button>
      </div>
      <Separator className="max-w-[30vw] bg-white/15" />
      <div className="flex max-w-[20vw] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">API Keys</div>
          <span className="text-sm text-white/70">
            Generate new API keys to use with the Keyshade CLI.
          </span>
        </div>
      </div>

      <Separator className="max-w-[30vw] bg-white/15" />

      <div className=" flex max-w-[30vw] justify-between rounded-3xl border border-red-500  bg-red-500/5 px-10 py-8">
        <div>
          <h2 className={` text-xl font-bold text-red-500`}>Delete account</h2>
          <p className="max-w-[20rem] text-sm text-white/70">
            Your account will be permanently deleted and access will be lost to
            any of your teams and data. This action is irreversible.
          </p>
        </div>

        <div className="flex items-center">
          <Button
            aria-label="Delete account"
            disabled={isLoading}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
