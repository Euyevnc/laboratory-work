import testSubnet from "./testSubnet";

export default function  pingChecking(firD, secD){
  const firMask = firD.mask,
        secMask = secD.mask,
        firIp = firD.ip,
        secIp = secD.ip;
  const secInVision = testSubnet(firIp, firMask, secIp)
  const firInVision = testSubnet(secIp, secMask, firIp)
  return(firInVision && secInVision)
}