'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser } from '@/firebase';
import { initiateSignOut } from '@/firebase/non-blocking-login';
import { Stethoscope } from 'lucide-react';

export function Header() {
  const { user } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    initiateSignOut(auth);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold font-grotesk text-gray-800">
              MedVerseAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.photoURL ?? ''}
                      alt={user?.displayName ?? 'User'}
                    />
                    <AvatarFallback>
                      {user?.displayName
                        ? user.displayName.charAt(0)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.displayName ?? 'Dr. Anderson'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email ?? 'physician@medverse.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
