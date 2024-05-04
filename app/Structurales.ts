import { Structurals } from "@/Classes/Structurals";
/**
 * This file is generated of Structurals
 */
import "./Structural/StructuralTailwind";
import "./Structural/StructuralPather";
import "./Structural/StructuralModels";
import "./Structural/StructuralLanguageWatcher";
import "./Structural/StructuralHttp";
import "./Structural/StructuralEvents";
import "./Structural/StructuralEnvWatcher";
import "./Structural/StructuralCrons";
import "./Structural/index";
async function Structurales () {
   /**
    * Childrens of Structures
    */

   // Childrens of Structure named Models
   const StructuralModels = Structurals.all[0]
   const gDWZlmOKAhjc0 = await import("./Database/Models/Users");
   if(StructuralModels && StructuralModels?.exec) await StructuralModels.exec(StructuralModels,gDWZlmOKAhjc0);
   const gPPn85gww05Ud = await import("./Database/Models/Activities");
   if(StructuralModels && StructuralModels?.exec) await StructuralModels.exec(StructuralModels,gPPn85gww05Ud);

   // Childrens of Structure named Http
   await import("./Http/Middlewares/Basement");
   await import("./Http/Routers/Languages");
   await import("./Http/Routers/Auth/Register");
   await import("./Http/Routers/Auth/Logout");
   await import("./Http/Routers/Auth/Login");

   // Childrens of Structure named Crons

} 
void Structurales();