"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Card, CardContent, CardFooter } from "@/components/ui/card";
=======
import { Card, CardContent } from "@/components/ui/card";
>>>>>>> 6dc8cf2 (first commit)
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth.client";
<<<<<<< HEAD
import { formatName } from "@/lib/utils";
=======
>>>>>>> 6dc8cf2 (first commit)

const registerSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    email: z.string().trim().email({ message: "Email inválido" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Senha é obrigatória e deve ter pelo menos 8 caracteres" }),
});

export function SignUpForm() {
    const router = useRouter();

    const formRegister = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
        try {
            await authClient.signUp.email(
                {
                    email: values.email,
                    password: values.password,
                    name: values.name,
                },
                {
                    onSuccess: () => {
                        toast.success("Cadastro realizado com sucesso!");
                        router.push("/"); // redireciona para login
                    },
                    onError: (ctx) => {
                        if (
                            ctx.error.code === "USER_ALREADY_EXISTS" ||
                            ctx.error.code === "EMAIL_ALREADY_EXISTS"
                        ) {
                            toast.error("Email já cadastrado, por favor faça login");
                        } else {
                            toast.error("Erro ao cadastrar, tente novamente");
                        }
                    },
                }
            );
        } catch {
            toast.error("Erro ao realizar cadastro");
        }
    }

    return (
<<<<<<< HEAD
        <div className="flex items-center justify-center w-full h-full min-h-screen bg-background p-4">
            <Card className="w-full max-w-md h-auto overflow-hidden">
                <CardContent className="p-4 md:p-6 lg:p-8 text-center flex flex-col justify-center h-full">
                    {/* Logo centralizada no topo do formulário */}
                    <div className="flex justify-center mb-6">
                        <Image src="/Logo.svg" alt="Logo" width={200} height={200} priority />
                    </div>

                    <Form {...formRegister}>
                        <form
                            onSubmit={formRegister.handleSubmit(onSubmitRegister)}
                            className="space-y-4"
                        >
                            <h1 className="text-xl md:text-2xl font-bold text-foreground">
                                Cadastro de Usuário
                            </h1>
                            <div className="space-y-4">
=======
        <div className="flex w-full h-full">
            {/* Lado esquerdo com logo */}
            <div className="flex items-center justify-center w-1/2 h-ful">
                <Image src="/Logo.svg" alt="Logo" width={400} height={400} priority />
            </div>

            {/* Lado direito com card */}
            <div className="flex items-center justify-center w-1/2 h-full">
                <Card className="w-2/3 h-auto overflow-hidden">
                    <CardContent className="p-6 md:p-8 text-center flex flex-col justify-center h-full">
                        <Form {...formRegister}>
                            <form
                                onSubmit={formRegister.handleSubmit(onSubmitRegister)}
                                className="flex flex-col gap-6 h-full justify-center"
                            >
                                <h1 className="text-2xl font-bold text-foreground">
                                    Cadastro de Usuário
                                </h1>

>>>>>>> 6dc8cf2 (first commit)
                                <FormField
                                    control={formRegister.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
<<<<<<< HEAD
                                            <FormLabel className="text-foreground">Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite seu nome"
                                                    onBlur={(e) => {
                                                        const formattedValue = formatName(e.target.value);
                                                        field.onChange(formattedValue);
                                                    }}
                                                    className="bg-background shadow-md focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                                                />
=======
                                            <FormLabel>Nome:</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Digite seu nome" />
>>>>>>> 6dc8cf2 (first commit)
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={formRegister.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
<<<<<<< HEAD
                                            <FormLabel className="text-foreground">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite seu email"
                                                    className="bg-background shadow-md focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                                                />
=======
                                            <FormLabel>Email:</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Digite seu email" />
>>>>>>> 6dc8cf2 (first commit)
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={formRegister.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
<<<<<<< HEAD
                                            <FormLabel className="text-foreground">Senha</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Crie sua senha"
                                                        className="bg-background shadow-md focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground pr-10"
                                                    />
                                                </div>
=======
                                            <FormLabel>Senha:</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Crie sua senha"
                                                />
>>>>>>> 6dc8cf2 (first commit)
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
<<<<<<< HEAD
                            </div>
                            <CardFooter className="p-0">
                                <Button
                                    type="submit"
                                    className="w-full text-white"
=======

                                <Button
                                    type="submit"
                                    className="w-full"
>>>>>>> 6dc8cf2 (first commit)
                                    disabled={formRegister.formState.isSubmitting}
                                >
                                    {formRegister.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
                                </Button>
<<<<<<< HEAD
                            </CardFooter>
                        </form>
                    </Form>
                    <Button variant="link" className="hover:bg-transparent font-extralight hover:text-primary hover:font-bold mt-4">
                        <Link href="/">
                            Fazer login no sistema
                        </Link>
                    </Button>
                </CardContent>
            </Card>
=======
                            </form>
                        </Form>
                        <Button variant="ghost" className="hover:bg-transparent font-extralight hover:text-primary hover:font-bold">
                            <Link href="/">
                                Fazer login no sistema
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
>>>>>>> 6dc8cf2 (first commit)
        </div>
    );
}
