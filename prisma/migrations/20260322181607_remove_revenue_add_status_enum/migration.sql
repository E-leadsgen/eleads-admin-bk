/*
  Warnings:

  - You are about to drop the column `revenue` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `idLeadStatus` on the `UserLead` table. All the data in the column will be lost.
  - You are about to drop the `LeadStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLead" DROP CONSTRAINT "UserLead_idLeadStatus_fkey";

-- AlterTable
ALTER TABLE "UserLead" DROP COLUMN "idLeadStatus";

-- DropTable
DROP TABLE "LeadStatus";

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('completed', 'in_progress', 'pending', 'cancel', 'sale');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "revenue",
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'pending';
