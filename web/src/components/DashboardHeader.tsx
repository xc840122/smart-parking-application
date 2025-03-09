'use client'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

type PathItem = {
  label: string;
  href: string;
  isLast: boolean;
};

const getPathItems = (path: string) => {
  try {
    if (path === "/") {
      return [{ label: "Home", href: "/", isLast: true }];
    }
    const pathStrs = path.split("/").filter(Boolean);
    const pathItems = pathStrs.map((item, index) => {
      return {
        label: item,
        href: `/${pathStrs.slice(0, index + 1).join("/")}`,
        isLast: index === pathStrs.length - 1,
      };
    });
    return pathItems;
  } catch (error) {
    throw new Error(`Error parsing path: ${error}`);
  }
}

const DashboardHeader = () => {
  const path = usePathname();
  const pathItems: PathItem[] = getPathItems(path) ?? [];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {pathItems.length > 0 && pathItems.map((item) => item.isLast ?
            (<div key={item.label}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem></div>
            )
            :
            (
              <div key={item.label} className="flex items-center gap-2">
                <BreadcrumbItem>
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header >
  );
}
export default DashboardHeader;
