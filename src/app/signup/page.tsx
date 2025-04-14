'use client';

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter} from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {query} from "@/lib/db";
import bcrypt from 'bcryptjs';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const {toast} = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert the new staff member into the database
      const result: any = await query(
        'INSERT INTO staff (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'Viewer'] // Default role is 'Viewer'
      );

      if (result.insertId) {
        toast({
          title: "Success",
          description: "Account created successfully. Please sign in.",
        });
        router.push('/signin'); // Redirect to sign-in page
      } else {
        toast({
          title: "Error",
          description: "Failed to create account.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Staff Account</CardTitle>
          <CardDescription>Enter your details to create an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full h-10">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
