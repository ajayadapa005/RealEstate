
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Initialize Supabase client
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Add timestamp and read status
      const inquiryData = {
        ...data,
        createdAt: new Date().toISOString(),
        status: "unread",
        bookmarked: false
      };
      
      // Insert data into Supabase
      const { error } = await supabase
        .from('inquiries')
        .insert([inquiryData]);
      
      if (error) throw error;
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="animate-fade-in">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Your Message..." 
                  {...field} 
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-black/90 text-white animate-fade-in hover-scale"
          style={{ animationDelay: "300ms" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
