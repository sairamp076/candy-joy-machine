
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, BarChart3, Package } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block p-2 bg-purple-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FunFinity AI
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Learning that's fun and infinite with AI
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/learning">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Explore Learning
              </Button>
            </Link>
            <Link to="/stock-tracking">
              <Button size="lg" variant="outline" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                Track Stock
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Learning Module
              </CardTitle>
              <CardDescription>Enhance your skills with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access personalized learning plans and track your progress with interactive AI-powered tools.</p>
            </CardContent>
            <CardFooter>
              <Link to="/learning" className="w-full">
                <Button variant="outline" className="w-full">Go to Learning</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Stock Tracking
              </CardTitle>
              <CardDescription>Monitor inventory with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track and visualize stock levels across all floors with interactive graphs and real-time data.</p>
            </CardContent>
            <CardFooter>
              <Link to="/stock-tracking" className="w-full">
                <Button variant="outline" className="w-full">Track Stock</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Stock Management
              </CardTitle>
              <CardDescription>Manage inventory efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Efficiently manage and refill inventory across all vending machines and floor managers.</p>
            </CardContent>
            <CardFooter>
              <Link to="/stock-management" className="w-full">
                <Button variant="outline" className="w-full">Manage Stock</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
