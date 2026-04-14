import type { ComponentType } from "react";
import {
  ArrowLeft,
  Bolt,
  CheckCircle2,
  Laptop,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { cn } from "../lib/utils";

type SiteIconName =
  | "add"
  | "add_shopping_cart"
  | "arrow_back"
  | "bolt"
  | "check_circle"
  | "forum"
  | "laptop_mac"
  | "person"
  | "remove"
  | "shopping_cart"
  | "storefront";

const iconMap = {
  add: Plus,
  add_shopping_cart: ShoppingCart,
  arrow_back: ArrowLeft,
  bolt: Bolt,
  check_circle: CheckCircle2,
  forum: MessageCircle,
  laptop_mac: Laptop,
  person: User,
  remove: Minus,
  shopping_cart: ShoppingCart,
  storefront: Store,
} satisfies Record<SiteIconName, ComponentType<{ className?: string }>>;

export function SiteIcon({ className, name }: { className?: string; name: SiteIconName }) {
  const IconComponent = iconMap[name];
  return <IconComponent aria-hidden="true" className={cn("inline-block h-[1em] w-[1em] shrink-0", className)} />;
}
