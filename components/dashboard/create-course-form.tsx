"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateCourseFormProps {
  url: string;
  suggestedTitle?: string;
  errorId?: number;
}

type TariffPrice = {
  title: "LIGHT" | "PRO" | "PRO MAX" | "CONSULTING";
  price: string;
};

export function CreateCourseForm({ url, suggestedTitle, errorId }: CreateCourseFormProps) {
  const [title, setTitle] = useState(suggestedTitle || "");
  const [description, setDescription] = useState("");
  const [tariffPrices, setTariffPrices] = useState<TariffPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const addTariffPrice = () => {
    setTariffPrices([...tariffPrices, { title: "LIGHT", price: "" }]);
  };

  const removeTariffPrice = (index: number) => {
    setTariffPrices(tariffPrices.filter((_, i) => i !== index));
  };

  const updateTariffPrice = (index: number, field: keyof TariffPrice, value: string) => {
    setTariffPrices(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Название курса не может быть пустым"
      });
      return;
    }

    if (!errorId) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "ID ошибки не найден"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/parse-errors/${errorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          tariff_prices: tariffPrices.filter(tp => tp.price.trim()),
          url: url
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании курса");
      }

      toast({
        title: "Успех",
        description: data.message || "Курс успешно создан"
      });

      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при создании курса"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Обработать ошибку
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-name">Название курса*</Label>
            <Input
              id="course-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название курса"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание курса"
              className="w-full"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>URL курса</Label>
            <Input value={url} disabled className="bg-muted" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Тарифы</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTariffPrice}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить тариф
              </Button>
            </div>
            
            {tariffPrices.map((tariff, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Тариф</Label>
                  <Select 
                    value={tariff.title} 
                    onValueChange={(value: TariffPrice["title"]) => updateTariffPrice(index, "title", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">LIGHT</SelectItem>
                      <SelectItem value="PRO">PRO</SelectItem>
                      <SelectItem value="PRO MAX">PRO MAX</SelectItem>
                      <SelectItem value="CONSULTING">CONSULTING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Цена</Label>
                  <Input
                    type="text"
                    value={tariff.price}
                    onChange={(e) => updateTariffPrice(index, "price", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => removeTariffPrice(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Создание..." : "Создать курс"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 