import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const form = await prisma.form_return.findUnique({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const organizationName = formData.get('organizationName') as string;
  const addressLine1 = formData.get('addressLine1') as string;
  const district = formData.get('district') as string;
  const amphoe = formData.get('amphoe') as string;
  const province = formData.get('province') as string;
  const zipcode = formData.get('zipcode') as string;
  const type = formData.get('type') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const image1 = formData.get('image1') as File | null;
  const image2 = formData.get('image2') as File | null;
  const numberOfSigners = parseInt(formData.get('numberOfSigners') as string);

  let image1Url: string | undefined;
  let image2Url: string | undefined;

  if (image1) {
    const byteLength1 = await image1.arrayBuffer();
    const bufferData1 = Buffer.from(byteLength1);

    const timestamp1 = new Date().getTime();
    const fileExtension1 = path.extname(image1.name) || '.jpg';
    const fileName1 = `${timestamp1}${fileExtension1}`;
    const pathOfImage1 = `./public/images/${fileName1}`;
    image1Url = `/images/${fileName1}`;

    await writeFile(pathOfImage1, bufferData1);
  }

  if (image2) {
    const byteLength2 = await image2.arrayBuffer();
    const bufferData2 = Buffer.from(byteLength2);

    const timestamp2 = new Date().getTime();
    const fileExtension2 = path.extname(image2.name) || '.jpg';
    const fileName2 = `${timestamp2}${fileExtension2}`;
    const pathOfImage2 = `./public/images/${fileName2}`;
    image2Url = `/images/${fileName2}`;

    await writeFile(pathOfImage2, bufferData2);
  }

  try {
    const updatedForm = await prisma.form_return.update({
      where: { id: Number(params.id) },
      data: {
        firstName,
        lastName,
        organizationName,
        addressLine1,
        district,
        amphoe,
        province,
        zipcode,
        type,
        phoneNumber,
        ...(image1Url && { image1: image1Url }),
        ...(image2Url && { image2: image2Url }),
        numberOfSigners,
      },
    });

    revalidatePath('/form_return');

    return NextResponse.json(updatedForm);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const deletedForm = await prisma.form_return.delete({
      where: { id: Number(params.id) },
    });

    revalidatePath('/form_return');

    return NextResponse.json(deletedForm);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
