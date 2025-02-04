import { Icons } from './icons';
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider
} from './ui/sidebar';

const projects = [
  { name: 'Profile', path: '/settings/profile', icon: Icons?.profile  },
  { name: 'Customization', path: '/settings/customization', icon: Icons?.settings },
  { name: 'Notifications', path: '/settings/notifications', icon: Icons?.home },
  { name: 'Account', path: '/settings/account', icon: Icons?.home },
];

export const SettingSidebarComponent = () => {
  return (

    <SidebarProvider className='fixed top-[6rem] left-8 w-52 '>


  <SidebarContent>
    <SidebarGroup>
      {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild className='p-5'>
                <a href={project.path}>
                  <project.icon />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>


      </SidebarProvider>

  );
};
