import { ComponentExample } from "@/components/component-example";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
return (
  <div className="p-4">
    <div className="flex justify-end mb-4">
      <ThemeToggle />
    </div>
    <ComponentExample />
  </div>
);
}
