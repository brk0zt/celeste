import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/providers/trpc";

export default function Signup() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/");
    },
    onError: (err: { message?: string }) => {
      setError(err.message || "Kayıt başarısız");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Tüm alanlar gereklidir");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1e]">
      <Card className="w-full max-w-sm bg-[#12121e] border-white/10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[#c8956c] text-xl">☾</span>
          </div>
          <CardTitle className="text-[#e0e0e0]">Kaydol</CardTitle>
          <p className="text-xs text-[#666] mt-1">Yeni hesap oluşturun</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#888] text-xs">İsim</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="bg-white/5 border-white/10 text-[#e0e0e0] placeholder:text-[#555]"
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#888] text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="bg-white/5 border-white/10 text-[#e0e0e0] placeholder:text-[#555]"
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#888] text-xs">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="bg-white/5 border-white/10 text-[#e0e0e0] placeholder:text-[#555]"
                disabled={registerMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#888] text-xs">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="bg-white/5 border-white/10 text-[#e0e0e0] placeholder:text-[#555]"
                disabled={registerMutation.isPending}
              />
            </div>
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#c8956c] hover:bg-[#b0845c] text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Kaydediliyor..." : "Kaydol"}
            </Button>
          </form>
          <p className="text-xs text-[#666] text-center mt-4">
            Zaten hesabınız var mı?{" "}
            <Link to="/login" className="text-[#c8956c] hover:underline">
              Giriş yapın
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
