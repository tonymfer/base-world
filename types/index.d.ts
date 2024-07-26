import type { Icon } from "lucide-react";

import { Icons } from "@/components/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

interface Coordinates {
  lat: string;
  lng: string;
  name: string;
}

interface Event {
  id: number;
  active?: boolean;
  contract?: string;
  description?: string;
  name?: string;
  date?: string;
  host?: string;
  users?: Attendees[];
}

type City = {
  color?: string;
  lat?: number;
  lng?: number;
  name?: string;
};

interface Attendees {
  name: string;
  address?: string;
  ens?: string;
  imageUrl?: string;
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };

export interface User {
  name: string;
  address: string;
  ens?: string;
  imageUrl: string;
}

export interface Event {
  id: number;
  name: string;
  active: boolean;
  date: string;
  host: string;
  contract?: string;
  users: User[];
  description: string;
}

export interface Location {
  id: number;
  city: string;
  country: string;
  mintToSupportLink?: string;
  events: Event[];
}
