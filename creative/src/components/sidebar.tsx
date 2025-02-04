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
  { name: 'Dashboard', path: '/', icon: Icons?.home },
  { name: 'Analytics', path: '/analytics', icon: Icons?.home },
  { name: 'Settings', path: '/settings', icon: Icons?.home },
];

export const SidebarComponent = () => {
  return (

      <SidebarProvider className='fixed top-[6rem] left-8 w-52'>


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
