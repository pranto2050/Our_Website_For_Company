import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results = {
      client: null as any,
      admin: null as any,
    };

    // Create demo client user
    const clientEmail = "demo.client@abitsolutions.com";
    const clientPassword = "Demo@123456";

    // Check if client already exists
    const { data: existingClient } = await supabaseAdmin.auth.admin.listUsers();
    const clientExists = existingClient?.users?.find(u => u.email === clientEmail);

    if (!clientExists) {
      const { data: clientUser, error: clientError } = await supabaseAdmin.auth.admin.createUser({
        email: clientEmail,
        password: clientPassword,
        email_confirm: true,
        user_metadata: { full_name: "Demo Client" },
      });

      if (clientError) {
        console.error("Client creation error:", clientError);
        results.client = { error: clientError.message };
      } else {
        // Update profile to approved
        await supabaseAdmin
          .from("profiles")
          .update({ 
            registration_status: "approved",
            full_name: "Demo Client",
            company_name: "Demo Company Ltd"
          })
          .eq("user_id", clientUser.user.id);

        results.client = { 
          email: clientEmail, 
          password: clientPassword,
          status: "created and approved" 
        };
      }
    } else {
      // Update existing client to approved
      await supabaseAdmin
        .from("profiles")
        .update({ registration_status: "approved" })
        .eq("user_id", clientExists.id);

      results.client = { 
        email: clientEmail, 
        password: clientPassword,
        status: "already exists - ensured approved" 
      };
    }

    // Create demo admin user
    const adminEmail = "demo.admin@abitsolutions.com";
    const adminPassword = "Admin@123456";

    const adminExists = existingClient?.users?.find(u => u.email === adminEmail);

    if (!adminExists) {
      const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: "Demo Admin" },
      });

      if (adminError) {
        console.error("Admin creation error:", adminError);
        results.admin = { error: adminError.message };
      } else {
        // Update profile to approved
        await supabaseAdmin
          .from("profiles")
          .update({ 
            registration_status: "approved",
            full_name: "Demo Admin"
          })
          .eq("user_id", adminUser.user.id);

        // Add admin role
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: adminUser.user.id, role: "admin" });

        results.admin = { 
          email: adminEmail, 
          password: adminPassword,
          status: "created with admin role" 
        };
      }
    } else {
      // Ensure admin role exists
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select()
        .eq("user_id", adminExists.id)
        .eq("role", "admin")
        .single();

      if (!existingRole) {
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: adminExists.id, role: "admin" });
      }

      // Update profile to approved
      await supabaseAdmin
        .from("profiles")
        .update({ registration_status: "approved" })
        .eq("user_id", adminExists.id);

      results.admin = { 
        email: adminEmail, 
        password: adminPassword,
        status: "already exists - ensured admin role" 
      };
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
