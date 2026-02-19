import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";

export default function Login() {
  return (
    <FormCard title="Log In">
      <FormField id="email" label="Email address" type="email" required />
      <FormField id="password" label="Password" type="password" required />
      <Button type="submit">Log In</Button>
    </FormCard>
  );
}
