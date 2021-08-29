
from selenium import webdriver
import pandas as pd
import os

path = 'selenium/' 
os.chdir(path) 

key = "เดอะนิช ไอดี พระราม 2"

driver = webdriver.Chrome("/Users/macbookpro/RealEs/New Site/chromedriver")
driver.get('https://www.ddproperty.com/รวมประกาศขาย?freetext='+key+'&market=residential&property_type_code[]=CONDO&property_type=N&maxprice=2000000')
datatxt=driver.find_element_by_id('listings-container').text

driver.close()
print(datatxt[0])

# movienames=driver.find_elements_by_class_name('ellipsis text-transform-none')
# Movienames=[name.text for name in movienames]   listings-container

# ratings = driver.find_elements_by_class_name('price')
# Ratings=[rating.text for rating in ratings]
# DF_IMDb=pd.DataFrame({'MovieNames':Movienames , 'Ratings':Ratings})
# #Get links
# links=driver.find_elements_by_xpath("//td[@class='titleColumn']/a")
# Links = [link.get_attribute('href') for link in links]
# DF_IMDb['Links']=Links
# #Set List to keep data in each link
# Director=[]
# ActorNames =[]
# CharacterNames =[]
# Storyline=[]
# Runtime=[]
# Genres=[]
# Releasedate=[]
# Budget=[]
# Worldwidegross=[]
# #Loop Links
# for link in range(0,len(Links)):
#     driver.get(Links[link])
#     #Get Director
#     director = driver.find_element_by_xpath("//div[@class='credit_summary_item']/a").text
#     #Get casts (ActorNames,CharactorNames)
#     casts = driver.find_elements_by_xpath("//table[@class='cast_list']/tbody/tr")
#     Actornames =[cast.text.split('...')[0] for cast in casts if str(cast.text.find('...')).isnumeric()]
#     Characternames =[cast.text.split('...')[1] for cast in casts if str(cast.text.find('...')).isnumeric()]
#     #Get storyline
#     storyline = driver.find_element_by_xpath("//div[@class='inline canwrap']/p/span").text
#     genres = driver.find_elements_by_xpath("//div[@id='titleStoryLine']/div[@class='see-more inline canwrap']")[1].text
#     genres2 =  genres[genres.find(" ")+1:]
#     Detail = driver.find_element_by_id("titleDetails").text
#     #Get releasedate
#     releasedate=Detail[Detail.find("Release Date:")+14:]
#     releasedate2=releasedate[0:releasedate.find("See more")-1]
#     #Get worldwidegross
#     worldwidegross=Detail[Detail.find("Cumulative Worldwide Gross:")+28:]
#     worldwidegross2=worldwidegross[0:worldwidegross.find("\n")]
#     #Get runtime
#     runtime=Detail[Detail.find("Runtime:")+9:]
#     runtime2=runtime[0:runtime.find("min")-1]    
#     Director.append(director)
#     ActorNames.append(Actornames)
#     CharacterNames.append(Characternames)
#     Storyline.append(storyline)
#     Runtime.append(runtime2)
#     Genres.append(genres2)
#     Releasedate.append(releasedate)
#     Worldwidegross.append(worldwidegross2)
# #Collect all data and Export to excel
# DF_IMDb2=pd.DataFrame({'Director':Director,'ActorNames':ActorNames,'CharacterNames':CharacterNames,'Storyline':Storyline,'Runtime':Runtime,'Genres':Genres,'Releasedate':Releasedate,'Worldwidegross':Worldwidegross})
# DF_IMDb=pd.concat([DF_IMDb, DF_IMDb2], axis=1)
# DF_IMDb.to_excel('DF_IMDb_Data.xlsx')

#VkaE-jMTP-01M4-mnXN
#curl --user seoufa.hostrec@gmail.com:VkaE-jMTP-01M4-mnXN https://app.easyblognetworks.com/api/v1/blogs/1/