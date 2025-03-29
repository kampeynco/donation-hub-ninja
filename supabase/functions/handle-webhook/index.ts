
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleRequest } from "./utils/requestHandler.ts";

serve(handleRequest);
