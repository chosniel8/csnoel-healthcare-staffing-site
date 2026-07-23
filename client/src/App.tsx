import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import About from "@/pages/About";
import Facilities from "@/pages/Facilities";
import Home from "@/pages/Home";
import JobDetail from "@/pages/JobDetail";
import Jobs from "@/pages/Jobs";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
