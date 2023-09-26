//Connection database with Prisma
/* npx prisma studio
Prisma studio http://localhost:5555/
 */
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
