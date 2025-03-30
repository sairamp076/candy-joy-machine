
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLearningContext } from "@/context/LearningContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  day: z.string().min(1, "Day is required"),
  learning_content_plan: z.string().min(1, "Learning content is required"),
  outcomes: z.string().min(1, "Outcomes are required"),
  motivation_on_product: z.string().min(1, "Motivation is required"),
  use_cases: z.string().min(1, "Use cases are required"),
  resources: z.string().min(1, "At least one resource is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AddLearningItemForm = () => {
  const [open, setOpen] = useState(false);
  const { addCustomLearningItem } = useLearningContext();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: "",
      learning_content_plan: "",
      outcomes: "",
      motivation_on_product: "",
      use_cases: "",
      resources: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const resources = values.resources.split("\n").filter(Boolean);
    
    addCustomLearningItem(values.day, {
      learning_content_plan: values.learning_content_plan,
      outcomes: values.outcomes,
      motivation_on_product: values.motivation_on_product,
      use_cases: values.use_cases,
      resources,
    });
    
    toast({
      title: "Success!",
      description: "Custom learning item added to your plan.",
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Plus size={16} />
          <span>Add Custom Learning Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Custom Learning Item</DialogTitle>
          <DialogDescription>
            Create your own learning item to add to your personalized learning plan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="learning_content_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What do you want to learn?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outcomes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Outcomes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What will you be able to do after learning this?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivation_on_product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Why is this important to learn?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="use_cases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use Cases</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How will you apply this knowledge?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resources (one URL per line)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://example.com/resource" 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Learning Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLearningItemForm;
