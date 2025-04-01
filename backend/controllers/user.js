const {nanoid} = require('nanoid')
const validator = require('validator')
const Url = require('../models/urlModel')

const postUrl = async (req, res) => {
  
  try {
    const {originalUrl} = req.body

    if(!validator.isURL(originalUrl)) {
      return res.status(400).json({error: 'Invalid URL'})
    }

    let url = await Url.findOne({originalUrl: originalUrl})
    if(url) {
      return res.json(url)
    }

    const shortCode = nanoid()
    let newUrl = new Url({
      originalUrl,
      shortCode
    })
    await newUrl.save()
    res.json(newUrl)

  } catch (error) {
    console.error(`Error in postUrl:- ${error}`)
  }
}

const fetchUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: 1 })
    res.json(urls)
  } 
  catch(err) {
    console.error(`Error in fetchUrls:- ${err}`)
    res.status(500).json({error: 'Server error'})
  }
}

const redirectUrl = async (req, res) => {
  try {
    const {shortCode} = req.params
    const url = await Url.findOne({shortCode: shortCode})

    if(!url) {
      return res.status(404).json({error: 'URL not found!!'})
    }

    url.clicks++
    await url.save()

    if(url.originalUrl.startsWith('https')) {
      return res.redirect(url.originalUrl)
    }
    return res.redirect(`https://${url.originalUrl}`)
  } catch (error) {
    console.error(`Error in redirectUrl:- ${error}`)
  }
}

module.exports = {
  postUrl,
  fetchUrls,
  redirectUrl
}