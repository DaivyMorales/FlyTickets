import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputWithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" size={1} placeholder="Email" />
    </div>
  )
}
