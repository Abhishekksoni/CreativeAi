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
  { name: 'Profile', path: '/settings/profile', icon: Icons?.home },
  { name: 'Customization', path: '/settings/customization', icon: Icons?.home },
  { name: 'Notifications', path: '/settings/notifications', icon: Icons?.home },
  { name: 'Account', path: '/settings/account', icon: Icons?.home },
];

export const SettingSidebarComponent = () => {
  return (

      <SidebarProvider>


  <SidebarContent>
    <SidebarGroup>
      {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
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
