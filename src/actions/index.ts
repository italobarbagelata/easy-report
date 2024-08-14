import { supabase } from "@/supabase/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export function createActionsForTable(table: string) {
  return {
    create: async (data: Record<string, any>) => {
      const result = await supabase.from(table).insert(data).single();
      //revalidatePath(`/${table}`);
      return JSON.stringify(result);
    },

    async read(start: number, end: number) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .range(start, end);

      if (error) {
        throw error;
      }

      return data;
    },

    deleteById: async (id: string) => {
      await supabase.from(table).delete().eq("id", id);
      //revalidatePath(`/${table}`);
    },

    updateById: async (id: string, data: Record<string, any>) => {
      await supabase.from(table).update(data).eq("id", id);
      //revalidatePath(`/${table}`);
    },
  };
}
