"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { SessionUser } from "@/types";

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-card/50 flex h-16 shrink-0 items-center justify-end border-b px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-600">
              {user.name ? (
                getInitials(user.name)
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <span className="hidden text-sm font-medium sm:block">
              {user.name ?? user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
