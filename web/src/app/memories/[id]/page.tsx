import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import ptBR from "dayjs/locale/pt-br";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";

dayjs.locale(ptBR);

export const revalidate = 0;

interface Memory {
  id: string;
  coverUrl: string;
  content: string;
  createdAt: string;
}

export default async function MemoryPage({
  params,
}: {
  params: { id: string };
}) {
  const headerList = headers();

  const domain = headerList.get("host") || "";
  const fullUrl = headerList.get("referer") || "";

  console.log(domain);
  console.log(fullUrl);

  const token = cookies().get("token")?.value;

  const response = await api.get(`/memories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => {
      return status <= 500;
    },
  });

  if (response.status !== 200) {
    return notFound();
  }

  const memory: Memory = await response.data;

  return (
    <div className="flex flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>

      <div key={memory.id} className="space-y-4">
        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
        </time>
        <Image
          src={memory.coverUrl}
          alt=""
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
        />
        <p className="text-lg leading-relaxed text-gray-100">
          {memory.content}
        </p>
      </div>
    </div>
  );
}
