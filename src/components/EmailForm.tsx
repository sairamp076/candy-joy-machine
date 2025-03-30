
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { fetchLearningPlan } from "@/services/learningService";
import { useLearningContext } from "@/context/LearningContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailFormProps {
  onSuccess: () => void;
}

const EmailForm = ({ onSuccess }: EmailFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, setLearningData } = useLearningContext();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const data = await fetchLearningPlan(values.email);
      setEmail(values.email);
      setLearningData(data);
      toast({
        title: "Success!",
        description: "Your personalized learning plan is ready.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error fetching learning plan:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your learning plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormDescription>
                  We'll use your email to personalize your learning experience and mentorship.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get My Personalized Learning Plan"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailForm;
