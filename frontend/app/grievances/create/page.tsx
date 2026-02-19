import Button from "~/app/components/ui/Button";
import FormCard from "~/app/components/ui/FormCard";
import FormField from "~/app/components/ui/FormField";
import FormSelect from "~/app/components/ui/FormSelect";

const CATEGORIES = [
  "Pay",
  "PTO",
  "Failure to Bargain",
  "Health & Safety",
  "Scheduling & Overtime",
  "Union Busting",
  "Other",
];

const POINT_PERSONS = ["Walter Reuther", "Cesar Chavez", "Clara Lemlich"];

export default function CreateGrievance() {
  return (
    <FormCard title="Create New Grievance">
      <input type="hidden" name="user_id" value="" />
      <FormField id="name" label="Name" required maxLength={255} />
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm leading-none font-medium select-none font-subtitle"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
        />
      </div>
      <FormSelect id="category" label="Category">
        <option></option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </FormSelect>
      <FormSelect id="point_person" label="Point Person">
        <option></option>
        {POINT_PERSONS.map((person) => (
          <option key={person} value={person}>
            {person}
          </option>
        ))}
      </FormSelect>
      <Button type="submit">Submit</Button>
    </FormCard>
  );
}
