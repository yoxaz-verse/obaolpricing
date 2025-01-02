const ROUTES = {
  // AUTH
  HOME: "/home",
  ABOUT: "/about",
  TESTIMONY: "/testimony",
  BLOG: "/blog",
  TERMS_CONDITION: "/tnc",
  CONTACT: "/contact",
  
  // Other routes not mentioned in BeforeLoginRoutes or AfterLoginRoutes
  NOTIFICATION: "/notification",
  MY_PROFILE: "/myprofile",
  SUBSCRIPTION:"/subscription"
};
const BeforeLoginRoutes = [
  {
    name: "Home",
    href: ROUTES.HOME,
    image: "/home.png",
  },
  {
    name: "About",
    href: ROUTES.ABOUT,
    image: "/about.png",
  },
  {
    name: "Testimony",
    href: ROUTES.TESTIMONY,
    image: "/testimonial.png",
  },
  {
    name: "Blog",
    href: ROUTES.BLOG,
  },
  {
    name: "Terms & Condition",
    href: ROUTES.TERMS_CONDITION,
  },
  {
    name: "Contact",
    href: ROUTES.CONTACT,
    image: "/contact.png",
  },
];

const AfterLoginRoutes = [
  {
    name: "Home",
    href: ROUTES.HOME,
    image: "/home.png",
  },
  {
    name: "Notification",
    href: ROUTES.NOTIFICATION,
    image: "/notification.png",
  },
  {
    name: "Subscription",
    href: ROUTES.SUBSCRIPTION,
    image: "/subscription.png",
  },
  {
    name: "My profile",
    href: ROUTES.MY_PROFILE,
    image: "/myprofile.png",
  },
  {
    name: "Contact",
    href: ROUTES.CONTACT,
    image: "/contact.png",
  },
];

export { BeforeLoginRoutes, AfterLoginRoutes, ROUTES };
