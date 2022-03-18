import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Clientes',
    icon: 'people',
    link: '/pages/clients',
  },
  {
    title: 'Proyectos',
    icon: 'home',
    link: '/pages/projects',
  },
  {
    title: 'Usuarios',
    icon: 'person',
    link: '/pages/users',
    home: true,
  },
];
