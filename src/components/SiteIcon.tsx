import type { ComponentType } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Award,
  BadgeCheck,
  Ban,
  Bolt,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsDown,
  CheckCircle2,
  Clock3,
  Code2,
  Gamepad2,
  Headset,
  Info,
  Laptop,
  Landmark,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Minus,
  PhoneCall,
  Plus,
  Rocket,
  Route,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Store,
  Terminal,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  UserSearch,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";

const iconMap = {
  add: Plus,
  add_shopping_cart: ShoppingCart,
  account_balance: Landmark,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  arrow_outward: ArrowUpRight,
  block: Ban,
  bolt: Bolt,
  call: PhoneCall,
  campaign: Megaphone,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  check_circle: CheckCircle2,
  close: X,
  code: Code2,
  delete: Trash2,
  distance: Route,
  forum: MessageCircle,
  groups: Users,
  headset_mic: Headset,
  info: Info,
  keyboard_double_arrow_down: ChevronsDown,
  keyboard_arrow_down: ChevronDown,
  laptop_mac: Laptop,
  location_on: MapPin,
  lock: Lock,
  login: LogIn,
  mail: Mail,
  neurology: BrainCircuit,
  payments: WalletCards,
  person: User,
  person_check: UserCheck,
  person_search: UserSearch,
  phone_iphone: Smartphone,
  remove: Minus,
  remove_shopping_cart: ShoppingBasket,
  rocket_launch: Rocket,
  schedule: Clock3,
  send: Send,
  shield: Shield,
  shopping_basket: ShoppingBasket,
  shopping_cart: ShoppingCart,
  sports_esports: Gamepad2,
  storefront: Store,
  support_agent: Headset,
  terminal: Terminal,
  trending_up: TrendingUp,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  workspace_premium: Award,
} as const satisfies Record<string, ComponentType<{ className?: string; strokeWidth?: number }>>;

export type SiteIconName = keyof typeof iconMap;

export function SiteIcon({
  className,
  name,
  strokeWidth = 1.9,
}: {
  className?: string;
  name: SiteIconName;
  strokeWidth?: number;
}) {
  const IconComponent = iconMap[name];
  return (
    <IconComponent
      aria-hidden="true"
      className={cn("inline-block h-[1em] w-[1em] shrink-0", className)}
      strokeWidth={strokeWidth}
    />
  );
}
