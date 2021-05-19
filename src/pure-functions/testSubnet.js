import IpSubnetCalculator from 'ip-subnet-calculator'

export default function visionChecking(entryIP, mask, goalIP) {
  if(!mask) return (entryIP == goalIP)

  const subnetData = IpSubnetCalculator.calculateCIDRPrefix( entryIP, mask )
  const rangeMin = subnetData.ipLowStr.split(".").map((el) => Number(el))
  const rangeMax = subnetData.ipHighStr.split(".").map((el) => Number(el)) 
  console.log(subnetData)
  let result = true 
  goalIP.split(".").map((el) => Number(el)).forEach((noda, index) => {
    if(!(noda >= rangeMin[index] && noda <= rangeMax[index])) result = false
  })

  return result
}