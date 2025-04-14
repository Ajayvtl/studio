
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to DataLens</CardTitle>
          <CardDescription>Your data analysis and visualization platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Explore the power of data with our tools and integrations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
